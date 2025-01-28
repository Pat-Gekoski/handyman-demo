import { View, Text, Image, StyleSheet } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import * as SQLite from 'expo-sqlite'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer'
import { usePathname, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { Location } from '@/types/interfaces'
import Logo from '@/assets/images/logo.png'

// const db = SQLite.openDatabaseSync('reports.db')
const LOGO_IMG = Image.resolveAssetSource(Logo).uri

const CustomDrawerContent = (props: any) => {
	const router = useRouter()
	const { bottom } = useSafeAreaInsets()
	const db = SQLite.useSQLiteContext()
	const [locations, setLocations] = useState<Location[]>([])
	const isDrawerOpen = useDrawerStatus() === 'open'
	const pathName = usePathname()

	useEffect(() => {
		if (isDrawerOpen) {
			loadLoactions()
		}
	}, [isDrawerOpen])

	const loadLoactions = async () => {
		const locations = await db.getAllAsync<Location>('SELECT * FROM locations')
		setLocations(locations)
	}

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView>
				<Image source={{ uri: LOGO_IMG }} style={styles.logo} />
				<View style={styles.locationsContainer}>
					<DrawerItemList {...props} />
					<Text style={styles.title}>Locations</Text>
					{locations.map((location) => {
						const isActive = pathName === `/location/${location.id}`
						return (
							<DrawerItem
								key={location.id}
								label={location.name}
								onPress={() => router.navigate(`/location/${location.id}`)}
								focused={isActive}
								activeTintColor='#F2A310'
							/>
						)
					})}
				</View>
			</DrawerContentScrollView>
			<View
				style={{
					paddingBottom: bottom,
					borderTopWidth: 1,
					borderTopColor: '#dde3fe',
					padding: 16,
				}}
			>
				<Text style={{ textAlign: 'center' }}>Copywright Galaxies 2024</Text>
			</View>
		</View>
	)
}

const Layout = () => {
	// useDrizzleStudio(db)

	return (
		<GestureHandlerRootView>
			<Drawer
				drawerContent={CustomDrawerContent}
				screenOptions={{ drawerHideStatusBarOnOpen: true, drawerActiveTintColor: '#F2A310', headerTintColor: '#000' }}
			>
				<Drawer.Screen
					name='index'
					options={{
						title: 'Manage Locations',
					}}
				/>
				<Drawer.Screen name='location' options={{ title: 'Location', headerShown: false, drawerItemStyle: { display: 'none' } }} />
			</Drawer>
		</GestureHandlerRootView>
	)
}

export default Layout

const styles = StyleSheet.create({
	logo: {
		width: 100,
		height: 100,
		alignSelf: 'center',
	},
	locationsContainer: {
		marginTop: 20,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		padding: 16,
		paddingTop: 24,
		color: '#a6a6a6',
	},
	footer: {
		paddingBottom: 20,
	},
})
