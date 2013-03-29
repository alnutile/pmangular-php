<?php
/**
 * Pull in Client data
 */

function tasksImport(){
        //1. Find all tasks in drupal
        //2. See if it exists
        //3. The pull in all the external relations for that task
	$sql = "SELECT nid, title, uid, created, body_value as body
                FROM node 
                LEFT JOIN field_data_body body ON body.entity_id = node.nid WHERE type LIKE 'task' LIMIT 10";
	try {
		$db = getConnectionMigrate();
		$stmt = $db->query($sql);  
		$tasks = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		foreach($tasks as $drupalRecord) {
			$seeIfExists = "SELECT t.id, t.drupalId, t.project_id, t.name, t.assigned, t.notify, t.notes, t.created, t.due,
                        t.expected_time, t.status, t.meeting, t.actual_time
                        FROM tasks t
                        WHERE t.drupalId = :drupalId";
			$dbExists = getConnection();
			$queryExists = $dbExists->prepare($seeIfExists);
			$queryExistNid = $drupalRecord->nid;
			$queryExists->bindParam("drupalId", $queryExistNid);
			$queryExists->execute();
			$rowExists = $queryExists->fetchAll(PDO::FETCH_OBJ);
			$dbExists = null;
			if(count($rowExists)) {
				//$compareRows = migrateCompareProject($rowExists[0], $drupalRecord);
			} else {
				$insert = migrateInsertTask($drupalRecord);
			}
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function migrateCompareTasks($newSystem, $drupalRecord){
	//See if it is worth updating
        if($newSystem->name != $drupalRecord->name || $drupalRecord->description != $newSystem->notes) {
		$sql = "UPDATE projects SET name=:name, notes=:notes WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("name", $drupalRecord->name);
                        $stmt->bindParam("notes", $drupalRecord->description);
			$stmt->bindParam("id", $newSystem->id);
			$stmt->execute();
			$db = null;
			error_log("migrateClient project id: $newSystem->id name: $drupalRecord->name Updated \n", 
			3, 
			'/var/tmp/pmmigrate.log');
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	} 
}

/**
 *Many Steps here
 *1. Make the task
 *2. Pull in from drupal the assigned users and relate them here
 *3. Pull in from drupal the notify users and pull in here
 *4. Pull in from drupal and set the related Project Id
 *5. Pull in from drupal and set the
 *6. Set Billable
 *7. Bring up in Meeting
 *8. Quoted Time
 *9. Estimated Time
 *10.Actual Time
 *11.Status
 *12.Feature or Interation related to
 **/

function migrateInsertTask($drupalRecord){
	$sql = "INSERT INTO tasks
                    (id, drupalId, project_id, name, assigned, notify, notes, created, due, expected_time, status, meeting, actual_time, billable)
                        VALUES
                    (NULL, :drupalId, :project_id, :name, NULL, NULL, :notes, :created, NULL, NULL, NULL, NULL, NULL, NULL)";
	//Need to see if there is a matching clientId
        //@todo finish this line
        $projectId = 0; //clientIdNewFromDrupalIdOld($drupalRecord->clientId);
        try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $drupalRecord->title);
		$stmt->bindParam("drupalId", $drupalRecord->nid);
                $stmt->bindParam("project_id", $projectId);
                $stmt->bindParam("notes", $drupalRecord->body);
                $stmt->bindParam("created", $drupalRecord->created);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("migrateProject Task id: $lastId name: $drupalRecord->title \n", 
		3, 
		'/var/tmp/pmmigrate.log');
		return $lastId;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


