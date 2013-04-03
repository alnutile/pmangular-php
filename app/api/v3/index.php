<?php

/**
 * @file
 * Setup basic endpoints
 * 
 * @todo make logging go into site parent folder not /var/tmp
 *    this means moving site up one folder
 * 
 */

require 'Slim/Slim.php';
require 'migration.php';
require 'clients.php';
require 'people.php';
require 'tasks.php';
require 'filters.php';

require 'migration_projects.php';
require 'migration_people.php';
require 'migration_features.php';
require 'migration_tasks.php';

$app = new Slim();

//Client URLs
$app->get('/client', 'getClients');
$app->get('/client/:id', 'getClient');
$app->get('/client/search/:query', 'findClientByName');
$app->post('/client', 'addClient');
$app->put('/client/:id', 'updateClient');
$app->delete('/client/:id',	'deleteClient');

//Tasks URLs
$app->get('/task', 'getTasks');
$app->get('/task/status/:id', 'getTasksByStatus');
$app->post('/task/filtered', 'getTasksByFilters');
$app->get('/task/:id', 'getTask');
$app->post('/task', 'addTasks');
$app->put('/task/:id', 'updateTask');
$app->delete('/task/:id',	'deleteTasks');


//Notify URLs
$app->get('/notify/bytask/:id', 'getNotifyByTask');

//Assign URLs
$app->get('/assign/bytask/:id', 'getAssignByTask');


//Filters
$app->get('/filter', 'getFilters');

//People URLs
$app->get('/person', 'getPeople');
$app->get('/person/:id','getPerson');
$app->post('/person', 'addPerson');
$app->put('/person/:id', 'updatePerson');
$app->delete('/person/:id',	'deletePerson');

//Hosting URLs
$app->get('/hostings', 'getHostings');
$app->get('/hostings/:id', 'getHosting');
$app->get('/hostings/search/:query', 'findByName');
$app->post('/hostings', 'addHosting');
$app->put('/hostings/:id', 'updateHosting');
$app->delete('/hostings/:id',	'deleteHosting');

//Migrations
$app->get('/migrate/client', 'clientImport');
$app->get('/migrate/project', 'projectImport');
$app->get('/migrate/people', 'peopleImport');
$app->get('/migrate/features', 'featuresImport');
$app->get('/migrate/tasks', 'tasksImport');

$app->run();

function getTasks() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$request = print_r($data, 1);
	error_log("Looking 2 for task {$request}", 3, '/var/tmp/pmangular.log');
	$sql = "select * FROM tasks ORDER BY id DESC";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getTask($id) {
	
	$sql = "SELECT t.* FROM tasks t WHERE t.id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$data = $stmt->fetchObject();  
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getTasksByStatus($id) {
	//What no parmBing?
	//It had touble dealing with an comma separated list.
	//@todo come back and get this to work with bindParam
	$id = mysql_real_escape_string($id);
	$sql = "select id, drupalId, project_id, name, created, due, expected_time, status, meeting, actual_time, billable, level  FROM tasks WHERE status IN($id) ORDER BY id DESC";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getAssignByTask($id) {
	$sql = "SELECT * FROM assigned
	WHERE taskId=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getNotifyByTask($id) {
	$sql = "SELECT * FROM notify
	WHERE taskId=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getTasksByFilters() {
	
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$conditions = array();

	//Text if any
	if(!empty($data->text)) {
		$textchosen = $data->text;
		$conditions[] = " ( name LIKE \"%$textchosen%\" OR notes LIKE \"%$textchosen%\" ) ";
	} 

	//Status 
	if(!empty($data->statuslist)) {
		$statusdchosen = (is_array($data->statuslist)) ? implode(',', $data->statuslist) : $data->statuslist;
		$conditions[] = " status IN($statusdchosen) ";
	} 

	//Start Date [startdate] => 2013-04-02
	if(!empty($data->startdate)) {
		$startdate = strtotime($data->startdate);
		if(!empty($data->enddate)) { 
			$enddate = strtotime($data->enddate);
		} else {
			$enddate = $startdate;
		}
		$conditions[] = " ( due >= $startdate AND due <= $enddate ) ";
	} 

	//Bring up in meeting
	if(!empty($data->bringup)) {
		$bringup = $data->bringup;
		$conditions[] = " meeting = 1 ";
	} 

	//Projects
	if(is_array($data->projects)) {
		$projectschosen = '';
		$projects = array();
		//This is an object due to the 
		//select grouping I am doing, I think
		foreach($data->projects as $key){
			$projects[] = $key->id;
		}
		$projectschosen = implode(',', $projects);
		 if(!empty($projectschosen)) {
		 	//@todo not sure why I need to do this last check
		 	//	some kinda swap going on if no project 
		 	//  selected versus selected
		 	$conditions[] = " project_id IN($projectschosen) ";
		 }
	} 

	//Assigned 
	if(is_array($data->assigned)) {
		$assignedchosen = implode(',', $data->assigned);
		if(count($conditions)) {
			$conditions = implode(' AND ', $conditions);
		}
		$sql = "select t.id, t.drupalId, t.project_id, t.name, a.people_id as assigned_person_id, notes, created, due, expected_time, status, meeting, actual_time, billable, level 
		FROM tasks t
		INNER JOIN assigned a ON a.taskId = t.id and a.people_id IN($assignedchosen) 
		WHERE $conditions
		GROUP BY t.id
		ORDER BY id DESC";
	} else {
		if(count($conditions)) {
			$conditions = implode(' AND ', $conditions);
		}
		$conditions = "WHERE $conditions ";
		$sql = "select t.id, t.drupalId, t.project_id, t.name, notes, created, due, expected_time, status, meeting, actual_time, billable, level
		FROM tasks t
		$conditions 
		ORDER BY id DESC";
	} 

	error_log("Actual Query {$sql} /n", 3, '/var/tmp/pmangular.log');

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}



function getHostings() {
	$sql = "select hostings.*, client.clientName, client.id as clientId FROM client
			LEFT JOIN hostings on client.id = hostings.clientId
			ORDER BY clientName";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$hostings = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($hostings);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getHosting($id) {
	$sql = "SELECT * FROM hostings WHERE clientId=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$hostings = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($hostings); 
	} catch(PDOException $e) {
		echo '{"error":{"text  for id '.$id.'":'. $e->getMessage() .'}}'; 
	}
}

function addHosting() {
	error_log('addHosting\n', 3, '/var/tmp/pmbackend.log');
	$request = Slim::getInstance()->request();
	$hosting = json_decode($request->getBody());
	$sql = "INSERT INTO hostings (id, clientId, levelId, notes, backuplocation1, backuplocation2) VALUES (NULL, :clientId, :levelId, :notes, :backuplocation1, :backuplocation2)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("levelId", $hosting->levelId);
		$stmt->bindParam("clientId", $hosting->clientId);
		$stmt->bindParam("notes", $hosting->notes);
		$stmt->bindParam("backuplocation1", $hosting->backuplocation1);
		$stmt->bindParam("backuplocation2", $hosting->backuplocation2);
		$stmt->execute();
		$hosting->id = $db->lastInsertId();
		$db = null;
		error_log("Add hosting record for client {$hosting->clientId}", 3, '/var/tmp/pmbackend.log');
		echo json_encode($hosting); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateHosting($id) {

	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$hosting = json_decode($body);
	$sql = "UPDATE hostings SET levelId=:levelId, notes=:notes, backuplocation1=:backuplocation1, backuplocation2=:backuplocation2 WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("levelId", $hosting->levelId);
		$stmt->bindParam("notes", $hosting->notes);
		$stmt->bindParam("backuplocation1", $hosting->backuplocation1);
		$stmt->bindParam("backuplocation2", $hosting->backuplocation2);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($hosting);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteHosting($id) {
	$sql = "DELETE FROM hostings WHERE id=:id";
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

function findByName($query) {
	$sql = "SELECT * FROM hostings WHERE UPPER(clientName) LIKE :query ORDER BY clientName";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$hostings = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($hostings);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="thisisit05";
	$dbname="phprest";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
