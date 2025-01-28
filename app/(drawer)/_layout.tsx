import { View, Text } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Layout = () => {
	return (
		<GestureHandlerRootView>
			<Drawer screenOptions={{ drawerHideStatusBarOnOpen: true, drawerActiveTintColor: '#F2A310', headerTintColor: '#000' }}>
				<Drawer.Screen
					name='index'
					options={{
						title: 'Manage Locations',
					}}
				/>
				<Drawer.Screen
					name='location'
					options={{
						title: 'Location',
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	)
}

export default Layout
