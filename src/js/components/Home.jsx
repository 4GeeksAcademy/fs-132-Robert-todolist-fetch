import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	// fetch async --> asincrono 
	const [myUser, setMyUser] = useState('Robert');
	const [data, setData] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [error, setError] = useState('')
	const url = 'https://playground.4geeks.com/todo'

	useEffect(() => {
		getMyUser()
	}, [])// para que se ejecute una sola vez al cargarse el componente

	const getMyUser = async () => {
		try {
			//aqui el codigo
			const resp = await fetch(url + '/users/' + myUser)
			if (resp.status === 404) {
				throw new Error('404 - user no found')
			}
			const data = await resp.json()
			return setData(data)
		} catch (error) {
			//el manejo de errores
			createMyUser()
		}
	}

	const createMyUser = async () => {
		try {
			//aqui el codigo
			const resp = await fetch(url + '/users/' + myUser, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (resp.ok) return getMyUser();
			throw new Error('aqui se acaba ');
		} catch (error) {
			//manejo de errores
			console.log(error)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			//codigo
			if (newTask.trim().length === 0) {
				return setError('no puede estar vacia la tarea')
			}
			if (newTask.trim().length < 3) {
				return setError('Tiene que ser superior a 3 caracteres')
			}
			const formatedData = {
				label: newTask.trim(),
				is_done: false
			}
			const resp = await fetch(url + '/todos/' + myUser, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formatedData)
			})
			if (!resp.ok) throw new Error('request not ok')
			setNewTask('')
			return getMyUser()
		} catch (error) {
			//manejo de errores
			console.log(error)
		}
	}
	const handleDelete = async (id) => {
		try {
			//codigo
			const resp = await fetch(url + '/todos/' + id, {
				method: "DELETE"
			})
			if (!resp.ok) throw new Error('error deleting')
			return getMyUser()
		} catch (error) {
			//el manejo de errores
			console.log(error)
			setError(error)
		}
	}
	//PUT -- necesita un ID para modificar, un body con informacion para actualizar el registro en bd		
	const handleDone = async ({ label, is_done, id }) => {
		try {
			const formatedData = {
				label,
				is_done: !is_done
			}
			const resp = await fetch(url + '/todos/' + id, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formatedData)
			})

			if (!resp.ok) throw new Error('error completing task')
			return getMyUser()
		} catch (error) {
			console.log(error)
			setError(error)
		}
	}

	return (
		<div className="container mt-5">
			<h1 className="text-center mb-5 display-5 fw-bold text-primary">Lista de Tareas - {myUser}</h1>

			{/* Formulario para agregar tareas */}
			<form className="mb-5" onSubmit={handleSubmit}>
				<div className="input-group input-group-lg">
					<input type="text"
						className="form-control"
						placeholder="New Task"
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
					/>
					<button className="btn btn-success px-4" type="submit">
						Add
					</button>
				</div>
				{error && <p className="text-danger mt-2 text-center">{error}</p>}
			</form>
			{/* lista de las tareas */}
			<ul className="list-group shadow-sm">
				{data.todos && data.todos.length > 0 ? (
					data.todos.map((task) => (
						<li
							key={task.id}
							className="list-group-item d-flex justify-content-between align-items-center py-3"
						>
							<span
								onClick={() => handleDone(task)}
								className={`task-text ${task.is_done ? 'task-completed' : ''}`}
							>
								{task.label}
							</span>
							<button
								onClick={() => handleDelete(task.id)}
								className="btn btn-outline-danger btn-sm px-3 py-2"
								title="delete"
							>
								<i className="fa-solid fa-trash"></i>
							</button>
						</li>
					))
				) : (
					<li className="list-group-item text-center py-4 text-muted">
						No hay tareas
					</li>
				)}
			</ul>
			{/* Contador de tareas */}
			{data.todos && data.todos.length > 0 && (
				<div className="text-center mt-4 text-muted">
					{data.todos.length} tarea{data.todos.length !== 1 ? 's' : ''}
				</div>
			)}
		</div>
	);
};

export default Home;