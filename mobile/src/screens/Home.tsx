import { useEffect, useState } from "react"
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base"
import { useNavigation } from "@react-navigation/native"
import { Group } from "@components/Group"
import { HomeHeader } from "@components/HomeHeader"
import { ExerciseCard } from "@components/ExerciseCard"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { api } from "@services/api"
import { AppError } from "@utils/AppError"

export function Home() {
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra'])
  const [groupSelected, setGroupSelected] = useState('costas')

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  async function fetchGroups() {
    try {
      const { data } = await api.get<string[]>('/groups')

      setGroups(data)
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

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

  useEffect(() => {
    fetchGroups()
  }, [])

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
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20
          }}
        />
      </VStack>
    </VStack>
  )
}