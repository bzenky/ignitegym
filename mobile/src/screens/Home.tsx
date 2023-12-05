import { useCallback, useEffect, useState } from "react"
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Group } from "@components/Group"
import { HomeHeader } from "@components/HomeHeader"
import { ExerciseCard } from "@components/ExerciseCard"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { ExerciseDTO } from "@dtos/ExerciseDTO"
import { Loading } from "@components/Loading"

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState('')

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  async function fetchGroups() {
    try {
      const { data } = await api.get<string[]>('/groups')

      setGroups(data)
      setGroupSelected(data[0])
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)
      const { data } = await api.get<ExerciseDTO[]>(`/exercises/bygroup/${groupSelected}`)

      setExercises(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      {isLoading
        ? <Loading />
        : (
          <VStack flex={1} px={8}>
            <HStack justifyContent='space-between' mb={5}>
              <Heading color='gray.200' fontSize='md' fontFamily='heading'>
                Exercícios
              </Heading>
              <Text color='gray.200' fontSize='sm'>
                {exercises.length}
              </Text>
            </HStack>

            <FlatList
              data={exercises}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ExerciseCard
                  onPress={handleOpenExerciseDetails}
                  data={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                paddingBottom: 20
              }}
            />
          </VStack>
        )
      }
    </VStack>
  )
}