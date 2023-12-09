import { useEffect, useState } from "react"
import { Heading, SectionList, Text, VStack, useToast } from "native-base"
import { ScreenHeader } from "@components/ScreenHeader"
import { HistoryCard } from "@components/HistoryCard"
import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { Loading } from "@components/Loading"
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO"

export function History() {
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)
      const { data } = await api.get<HistoryByDayDTO[]>('/history')

      setExercises(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading
        ? <Loading />
        : (
          <SectionList
            sections={exercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              return <HistoryCard data={item} />
            }}
            renderSectionHeader={({ section }) => (
              <Heading color="gray.200" fontSize="md" fontFamily='heading' mt={10} mb={3}>
                {section.title}
              </Heading>
            )}
            contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
            ListEmptyComponent={() => (
              <Text color='gray.100' textAlign="center">
                Não há exercícios registrados ainda. {'\n'}
                Vamos fazer exercícios hoje ?
              </Text>
            )}
            px={8}
            showsVerticalScrollIndicator={false}
          />
        )
      }
    </VStack>
  )
}