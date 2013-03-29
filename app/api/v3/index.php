<?php

/**
 * @file
 * Setup basic endpoints
 * 
 * @todo make logging go into site parent folder not /var/tmp
 *    this means moving sit up one folder
 * 
 */

require 'Slim/Slim.php';
require 'migration.php';
require 'clients.php';
require 'migration_projects.php';
require 'migration_people.php';
require 'migration_features.php';
require 'migration_tasks.php';

$app = new Slim();

//Client URLs
$app->get('/client', 'getClients');
$app->get('/clients/:id',	'getClient');
$app->get('/clients/search/:query', 'findClientByName');
$app->post('/clients', 'addClient');
$app->put('/clients/:id', 'updateClient');
$app->delete('/clients/:id',	'deleteClient');

//Hosting URLs
$app->get('/hostings', 'getHostings');
$app->get('/hostings/:id',	'getHosting');
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

function getClients() {
	$sql = "select *, client.id as clientId FROM client ORDER BY clientName";
	error_log('Running Clients Query inline', 3, '/var/tmp/pmbackend.log'); 
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$clients = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$results = print_r($clients, 1);
		error_log($results, 3, '/var/tmp/pmbackend.log'); 

		echo json_encode($clients);
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
