import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Exercise } from "@screens/Exercise"
import { History } from "@screens/History"
import { Home } from "@screens/Home"
import { Profile } from "@screens/Profile"

type AppRoutes = {
  home: undefined
  history: undefined
  profile: undefined
  exercise: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false
    }}>
      <Screen
        name="home"
        component={Home}
      />

      <Screen
        name="history"
        component={History}
      />

      <Screen
        name="profile"
        component={Profile}
      />

      <Screen
        name="exercise"
        component={Exercise}
      />
    </Navigator>
  )
}