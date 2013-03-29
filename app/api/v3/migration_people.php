<?php
/**
 * Pull in Client data
 */

function peopleImport(){
	$sql = "SELECT uid, mail, name, status from users";
	try {
		$db = getConnectionMigrate();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		foreach($users as $drupalRecord) {
			$seeIfExists = "SELECT p.email, p.id, p.drupalId, p.fname, p.lname FROM people as p
                        WHERE p.drupalId = :drupalId";
			$dbExists = getConnection();
			$queryExists = $dbExists->prepare($seeIfExists);
			$queryExistTid = $drupalRecord->uid;
			$queryExists->bindParam("drupalId", $queryExistTid);
			$queryExists->execute();
			$rowExists = $queryExists->fetchAll(PDO::FETCH_OBJ);
			$dbExists = null;
			if(count($rowExists)) {
				$compareRows = migrateComparePeople($rowExists[0], $drupalRecord);
			} else {
				$insert = migrateInsertPeople($drupalRecord);
			}
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function migrateComparePeople($newSystem, $drupalRecord){
	//See if it is worth updating
        if($newSystem->email != $drupalRecord->mail) {
		$sql = "UPDATE people SET email=:email WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("email", $drupalRecord->mail);
			$stmt->bindParam("id", $newSystem->id);
			$stmt->execute();
			$db = null;
			error_log("migrate User id: $newSystem->id name: $drupalRecord->email Updated \n", 
			3, 
			'/var/tmp/pmmigrate.log');
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	} 
}

/**
 *Need to relate to existing client
 **/

function migrateInsertPeople($drupalRecord){
	$sql = "INSERT INTO people (id, drupalId, email, fname, lname, clientId, status) VALUES (NULL, :drupalId, :email, null, null, null, :status)";

        try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("drupalId", $drupalRecord->uid);
		$stmt->bindParam("email", $drupalRecord->mail);
                $stmt->bindParam("status", $drupalRecord->status);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("migratePeople id: $lastId name: $drupalRecord->uid Inserted \n", 
		3, 
		'/var/tmp/pmmigrate.log');
		return $lastId;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


