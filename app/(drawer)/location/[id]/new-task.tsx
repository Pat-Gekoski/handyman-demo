import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { Task } from '@/types/interfaces'

const Page = () => {
	const { id, taskId } = useLocalSearchParams()
	const locationId = Array.isArray(id) ? id[0] : id
	const router = useRouter()
	const db = useSQLiteContext()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [isUrget, setIsUrget] = useState(false)
	const [imageUri, setImageUri] = useState<string | null>(null)

	useEffect(() => {
		if (taskId) {
			loadTaskData()
		}
	}, [taskId, db])

	const loadTaskData = async () => {
		const task = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [Number(taskId)])
		if (task) {
			setTitle(task.title)
			setDescription(task.description)
			setIsUrget(task.isUrgent === 1 ? true : false)
			setImageUri(task.imageUri || null)
		}
	}

	const handleFinishTask = async () => {
		Alert.alert('Finish Task', 'Are you sure you want to finish this task?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Finish',
				onPress: async () => {
					await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [Number(taskId)])
					router.back()
				},
			},
		])
	}

	const handleSaveTask = async () => {
		let newTaskId = Number(taskId)

		if (taskId) {
			// update
			await db.runAsync(`UPDATE tasks SET title = ?, description = ?, isUrgent = ?, imageUri = ? WHERE id = ?`, [
				title,
				description,
				isUrget ? 1 : 0,
				imageUri,
				newTaskId,
			])
		} else {
			//insert
			const result = await db.runAsync(
				`INSERT INTO tasks (locationId, title, description, isUrgent, imageUri) VALUES (?, ?, ?, ?, ?)`,
				[Number(locationId), title, description, isUrget ? 1 : 0, imageUri],
			)
			newTaskId = result.lastInsertRowId
		}

		if (isUrget) {
			// notifications
		}

		router.back()
	}

	return (
		<View style={styles.container}>
			<TextInput style={styles.input} placeholder='Title' value={title} onChangeText={setTitle} />
			<TextInput
				style={[styles.input, styles.multilineInput]}
				placeholder='Description'
				value={description}
				onChangeText={setDescription}
				multiline
			/>
			<View style={styles.row}>
				<Text>Urgent</Text>
				<Switch value={isUrget} onValueChange={setIsUrget} trackColor={{ false: '#767577', true: '#f2a310' }} />
			</View>

			<TouchableOpacity style={styles.button} onPress={handleSaveTask}>
				<Text style={styles.buttonText}>{taskId ? 'Update Task' : 'Create Task'}</Text>
			</TouchableOpacity>

			{taskId && (
				<TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleFinishTask}>
					<Text style={[styles.buttonText]}>Finish Task</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 8,
		marginBottom: 16,
		backgroundColor: '#fff',
		borderRadius: 4,
	},
	multilineInput: {
		height: 100,
		textAlignVertical: 'top',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		justifyContent: 'space-between',
	},
	button: {
		backgroundColor: '#f2a310',
		padding: 16,
		alignItems: 'center',
		borderRadius: 4,
		justifyContent: 'center',
		marginBottom: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	finishButton: {
		backgroundColor: '#4caf50',
	},
})
