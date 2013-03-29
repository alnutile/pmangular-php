<?php
/**
 * Pull in Client data
 */

function featuresImport(){
	$sql = "SELECT tid, name, description, p.field_related_project_tid as relatedProjectDrupalId, f.related_project
                FROM taxonomy_term_data f
		LEFT JOIN field_data_field_related_project p ON p.entity_id = f.tid
		WHERE vid =8";
	try {
		$db = getConnectionMigrate();
		$stmt = $db->query($sql);  
		$features = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		foreach($features as $drupalRecord) {
			$seeIfExists = "SELECT f.id, f.drupalId, f.name, f.notes FROM features as f
                        WHERE f.drupalId = :drupalId";
			$dbExists = getConnection();
			$queryExists = $dbExists->prepare($seeIfExists);
			$queryExistTid = $drupalRecord->tid;
			$queryExists->bindParam("drupalId", $queryExistTid);
			$queryExists->execute();
			$rowExists = $queryExists->fetchAll(PDO::FETCH_OBJ);
			$dbExists = null;
			if(count($rowExists)) {
				echo "Drupal tid of project {$drupalRecord->relatedProjectDrupalId}";
				$compareRows = migrateCompareFeatures($rowExists[0], $drupalRecord);
			} else {
				$insert = migrateInsertFeatures($drupalRecord);
			}
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function migrateCompareFeatures($newSystem, $drupalRecord){
	//See if it is worth updating
        if($newSystem->name != $drupalRecord->name || $drupalRecord->description != $newSystem->notes || $drupalRecord->relatedProjectDrupalId != $newSystem->related_project) {
		$sql = "UPDATE features SET name=:name, notes=:notes, related_project=:relatedProject WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("name", $drupalRecord->name);
                        $stmt->bindParam("notes", $drupalRecord->description);
			$stmt->bindParam("relatedProject", $drupalRecord->relatedProjectDrupalId);
			$stmt->bindParam("id", $newSystem->id);
			$stmt->execute();
			$db = null;
			error_log("migrateFeature project id: $newSystem->id name: $drupalRecord->name Updated \n", 
			3, 
			'/var/tmp/pmmigrate.log');
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	} 
}

/**
 *Need to also consider Project ID from before
 **/

function migrateInsertFeatures($drupalRecord){
	$sql = "INSERT INTO features (id, drupalId, name, notes, related_project) VALUES (NULL, :drupalId, :name, :notes, :related_project)";
	//Need to see if this matches and existing project
	$drupalProjectId = projectIdNewFromDrupalIdOld($drupalRecord->relatedProjectDrupalId);
        try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $drupalRecord->name);
		$stmt->bindParam("drupalId", $drupalRecord->tid);
		$stmt->bindParam("related_project", $drupalProjectId);
                $stmt->bindParam("notes", $drupalRecord->description);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("migrateProject Features id: $lastId name: $drupalRecord->name Inserted \n", 
		3, 
		'/var/tmp/pmmigrate.log');
		return $lastId;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}