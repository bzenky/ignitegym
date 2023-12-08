import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base"
import { TouchableOpacity } from "react-native"
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button"
import { api } from "@services/api"
import { useEffect, useState } from "react"
import { Loading } from "@components/Loading"
import { ExerciseDTO } from "@dtos/ExerciseDTO"
import { AppError } from "@utils/AppError"

type RoutesParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const routes = useRoute()
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingRegister, setIsSendingRegister] = useState(false)

  const { exerciseId } = routes.params as RoutesParamsProps
  const toast = useToast()

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const { data } = await api.get<ExerciseDTO>(`/exercises/${exerciseId}`)

      setExercise(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setIsSendingRegister(true)

      await api.post('/history', {
        exercise_id: exerciseId
      })

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.700'
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsSendingRegister(false)
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [])

  return (
    <VStack flex={1}>
      {isLoading
        ? <Loading />
        : (
          <>
            <VStack bg="gray.600" px={8} pt={12}>
              <TouchableOpacity onPress={handleGoBack}>
                <Icon
                  as={Feather}
                  name="arrow-left"
                  color="green.500"
                  size={6}
                />

                <HStack justifyContent="space-between" alignItems="center" mt={4} mb={8}>
                  <Heading color="gray.100" fontSize="lg" fontFamily='heading' flexShrink={1}>
                    {exercise.name}
                  </Heading>

                  <HStack alignItems="center">
                    <BodySvg />

                    <Text color="gray.200" ml={1} textTransform="capitalize">
                      {exercise.group}
                    </Text>
                  </HStack>
                </HStack>
              </TouchableOpacity>
            </VStack>

            <ScrollView>
              <VStack p={8}>
                <Box rounded="lg" mb={3} overflow="hidden">
                  <Image
                    w="full"
                    h={80}
                    source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                    alt="Nome do exercício"
                    resizeMode="cover"
                  />
                </Box>

                <Box bg="gray.600" rounded="md" pb={4} px={4}>
                  <HStack alignItems="center" justifyContent="space-around" mt={5} mb={6}>
                    <HStack alignItems="center">
                      <SeriesSvg />

                      <Text color="gray.200" ml={2}>
                        {exercise.series} séries
                      </Text>
                    </HStack>

                    <HStack alignItems="center">
                      <RepetitionsSvg />

                      <Text color="gray.200" ml={2}>
                        {exercise.repetitions} repetições
                      </Text>
                    </HStack>
                  </HStack>

                  <Button
                    title="Marcar como realizado"
                    onPress={handleExerciseHistoryRegister}
                    isLoading={isSendingRegister}
                  />
                </Box>
              </VStack>
            </ScrollView>
          </>
        )
      }
    </VStack>
  )
}