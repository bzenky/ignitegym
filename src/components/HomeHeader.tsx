import { TouchableOpacity } from "react-native"
import { Icon, HStack, Heading, Text, VStack } from "native-base"
import { MaterialIcons } from '@expo/vector-icons'
import { UserPhoto } from "./UserPhoto"

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems='center'>
      <UserPhoto
        source={{ uri: 'https://www.github.com/bzenky.png' }}
        size={16}
        alt="Profile Photo"
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize='md'>Olá,</Text>
        <Heading color="gray.100" fontSize='md' fontFamily='heading'>Zenky</Heading>
      </VStack>

      <TouchableOpacity>
        <Icon
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}