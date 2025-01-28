import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import LocationForm from '@/components/LocationForm'
import { Location } from '@/types/interfaces'
import LocationListItem from '@/components/LocationListItem'

const Page = () => {
	const db = useSQLiteContext()
	const [locations, setLocations] = useState<Location[]>([])

	useEffect(() => {
		loadLoactions()
	}, [])

	const loadLoactions = async () => {
		const locations = await db.getAllAsync<Location>('SELECT * FROM locations')
		setLocations(locations)
	}

	const addLocation = async (name: string) => {
		await db.runAsync('INSERT INTO locations (name) VALUES (?)', name)
		loadLoactions()
	}

	return (
		<View style={styles.container}>
			<LocationForm onSubmit={addLocation} />
			<FlatList
				data={locations}
				renderItem={({ item }) => <LocationListItem location={item} onDelete={loadLoactions} />}
				ListEmptyComponent={<Text>No locations added yet</Text>}
			/>
		</View>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	emptyText: {
		fontSize: 16,
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 16,
	},
})
