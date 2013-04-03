<?php

/**
 * @file
 * People related end points
 */

// function getTasks() {
// 	$sql = "select * FROM tasks ORDER BY id";
// 	try {
// 		$db = getConnection();
// 		$stmt = $db->query($sql);  
// 		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
// 		$db = null;
// 		echo json_encode($data);
// 	} catch(PDOException $e) {
// 		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
// 	}
// }



function addTask() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$sql = "INSERT INTO people (id, drupalId, email, fname, lname, clientId, status, phone, notes) VALUES (NULL, NULL, :email, :fname, :lname, :clientId, :status, :phone, :notes)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("fname", $data->fname);
		$stmt->bindParam("lname", $data->lname);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("clientId", $data->clientId);
		$stmt->bindParam("status", $data->status);
		$stmt->bindParam("phone", $data->phone);
		$stmt->bindParam("notes", $data->notes);

		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function updateTask($id) {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$test = print_r($data, 1);

	$conditions = array();
	//1. actual_time
	//2. MOVED assigned to own table
	//3. billable
	//4. drupalId
	//5. created 
	//    back to unix
	$data->created = strtotime($data->created);
	//6. expected_time
	//7. id
	//8. meeting
	//9. name
	//__ MOVED notify
	//    this one needs to go off into a side function to manage the other table as needed
	//10. project_id 
	//      On a new load of the page this is object
	// 		if the user changes the select list it is array
	//11. status
	//12. notes
	//13. due 
	(!empty($data->due)) ? $data->due = strtotime($data->due) : '';
	//      back to unix

	$test = print_r($data, 1);
	error_log("Results of Task Update {$test}", 3, '/var/tmp/pmangular.log');
	$sql = "UPDATE tasks SET 
				project_id=:project_id,
				name=:name,
				notes=:notes,
				due=:due,
				created=:created,
				expected_time=:expected_time,
				status=:status,
				meeting=:meeting,
				actual_time=:actual_time,
				billable=:billable
				WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("project_id", $data->project_id);
		$stmt->bindParam("name", $data->name);
		// $stmt->bindParam("assigned", $data->assigned);
		$stmt->bindParam("notes", $data->notes);
		$stmt->bindParam("due", $data->due);
		$stmt->bindParam("created", $data->created);
		$stmt->bindParam("expected_time", $data->expected_time);
		$stmt->bindParam("status", $data->status);
		$stmt->bindParam("meeting", $data->meeting);
		$stmt->bindParam("actual_time", $data->actual_time);
		$stmt->bindParam("billable", $data->billable);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



function deleteTask($id) {
	$sql = "DELETE FROM people WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>