import React, { useCallback, useState } from 'react'
import TaskListItem from '@/components/TaskListItem'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { Task } from '@/types/interfaces'

const Page = () => {
	const { id } = useLocalSearchParams()
	const router = useRouter()
	const db = useSQLiteContext()
	const [tasks, setTasks] = useState<Task[]>([])
	const [locationName, setLocationName] = useState('')

	const loadLocationData = useCallback(async () => {
		const [location] = await db.getAllAsync<{ name: string }>('SELECT * FROM locations WHERE id = ?', [Number(id)])

		if (location) {
			setLocationName(location.name)
		}

		const tasks = await db.getAllAsync<Task>(`SELECT * FROM tasks WHERE locationId = ?`, [Number(id)])
		setTasks(tasks)
	}, [id, db])

	useFocusEffect(
		useCallback(() => {
			loadLocationData()
		}, [loadLocationData]),
	)

	return (
		<View style={{ flex: 1 }}>
			<Stack.Screen options={{ title: locationName || 'Tasks' }} />
			<FlatList
				data={tasks}
				renderItem={({ item }) => <TaskListItem task={item} />}
				ListEmptyComponent={<Text style={styles.emptyText}>No tasks found.</Text>}
			/>
			<Link href={`/location/${id}/new-task`} asChild>
				<TouchableOpacity style={styles.fabButton}>
					<Text style={styles.fabText}>+</Text>
				</TouchableOpacity>
			</Link>
		</View>
	)
}

export default Page

const styles = StyleSheet.create({
	fabButton: {
		position: 'absolute',
		width: 56,
		height: 56,
		alignItems: 'center',
		justifyContent: 'center',
		right: 20,
		bottom: 20,
		backgroundColor: '#f2a310',
		borderRadius: 28,
		elevation: 8,
		shadowOffset: { width: 0, height: 2 },
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	fabText: {
		color: '#fff',
		fontSize: 24,
	},
	emptyText: {
		fontSize: 18,
		textAlign: 'center',
		marginTop: 20,
	},
})
