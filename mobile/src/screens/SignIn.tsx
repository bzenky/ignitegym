import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base"
import { useNavigation } from "@react-navigation/native"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from "@components/Input"
import { Button } from "@components/Button"
import { AuthNavigatorRoutesProps } from "@routes/auth.routes"
import { useAuth } from "@hooks/useAuth"
import { Controller, useForm } from "react-hook-form"

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve conter no mínimo 6 caracteres'),
})

type FormDataProps = {
  email: string
  password: string
}

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const { signIn } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  })

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  function handleSignIn({ email, password }: FormDataProps) {
    signIn(email, password)
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color="gray.100"
            fontSize="xl"
            mb={6}
            fontFamily="heading"
          >
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>

        <Center mt={24}>
          <Text
            color="gray.100"
            fontSize="sm"
            mb={3}
            fontFamily="body"
          >
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}