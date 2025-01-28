import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

type LocationFormProps = {
	onSubmit: (name: string) => void
}

const LocationForm = ({ onSubmit }: LocationFormProps) => {
	const [name, setName] = useState<string>('')

	const handleSubmit = () => {
		if (name.trim()) {
			onSubmit(name)
			setName('')
		}
	}

	return (
		<View style={styles.container}>
			<TextInput style={styles.input} onChangeText={setName} value={name} />
			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Submit</Text>
			</TouchableOpacity>
		</View>
	)
}

export default LocationForm

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		backgroundColor: '#fff',
		padding: 8,
		flex: 1,
	},
	button: {
		backgroundColor: '#000',
		padding: 8,
		borderRadius: 4,
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
})
