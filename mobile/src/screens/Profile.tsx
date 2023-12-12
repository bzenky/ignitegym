import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { Input } from "@components/Input"
import { Button } from "@components/Button"
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useAuth } from "@hooks/useAuth"
import { yupResolver } from "@hookform/resolvers/yup"
import { AppError } from "@utils/AppError"
import { api } from "@services/api"

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string
  email: string
  old_password?: string | null | undefined
  password?: string | null | undefined
  confirm_password?: string | null | undefined
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email(),
  old_password: yup.string().min(6, 'A senha deve conter no mínimo 6 caracteres').nullable(),
  password: yup.string().min(6, 'A senha deve conter no mínimo 6 caracteres').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) => schema.nullable().required('Informe a confirmação da senha').transform((value) => !!value ? value : null)
    }),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/bzenky.png')
  const { user, updateUserProfile } = useAuth()

  const toast = useToast()
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver<FormDataProps>(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    }
  })

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) return

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024 > 5)) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB",
            placement: "top",
            bgColor: 'red.500'
          })
        }

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log({ data })
    try {
      setIsUpdatingProfile(true)

      await api.put('/users', data)

      const updatedUser = user
      updatedUser.name = data.name

      updateUserProfile(updatedUser)

      toast.show({
        title: 'Dados atualizados com sucesso.',
        placement: 'top',
        bgColor: 'green.700'
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar os seus dados.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded='full'
                startColor='gray.500'
                endColor='gray.400'
              />
              : <UserPhoto
                source={{ uri: userPhoto }}
                alt='Foto do usuário'
                size={PHOTO_SIZE}
              />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                bg="gray.600"
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => (
              <Input
                placeholder="E-mail"
                value={value}
                bg="gray.600"
                isDisabled
              />
            )}
          />

          <Heading
            color='gray.200'
            fontSize='md'
            fontFamily='heading'
            mb={2}
            mt={12}
            alignSelf='flex-start'
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdatingProfile}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}