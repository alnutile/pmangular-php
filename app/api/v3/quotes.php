<?php

function getQuotesForClient($id) {
	$data = new QuotesCrud();
	$results = $data->get(array('id' => $id));
	echo json_encode($results);
}

function addQuote() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
 	$test = print_r($data, 1);
  	error_log("Results of Quote Update {$test}", 3, '/var/tmp/pmangularQuotes.log');
  	$quoteCrud = new QuotesCrud();
  	$results = $quoteCrud->post($data);
  	echo json_encode($results); 
}


class QuotesCrud {
	public $object; //Quote Submit Object


	function __construct() {

	}

	public function post($object) {
		$general = $object->general;
		$object2Array = get_object_vars($general);
		$prepareQuery = self::_prepareQueryArray($object2Array);
		$set = $prepareQuery['set'];
		$values = $prepareQuery['values'];
		$sql = "INSERT INTO quotes 
		 	($set) 
		 	VALUES 
		 	($values)";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->execute();
			$lastId = $db->lastInsertId();
			$object->general->id = $lastId;
			$db = null;
			self::_destroyCreateIncludedItems($object->includedItems, $lastId);
			self::_destroyCreateNotIncludedItems($object->notIncludedItems, $lastId);
			self::_destroyCreateAssumptions($object->assumptions, $lastId);
			self::_destroyCreateLineItems($object->lineitems, $lastId);
			self::_destroyCreateOverHead($object->overhead, $lastId);

			return $object; 
		} catch(PDOException $e) {
			error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	}

	public function get($params) {
		//build data object
		//general
		//includedItems
		//notIncludedItems
		//assumptions
		//lineitems
		//overhead
		$data = new stdClass;
		$wheres = array('clientid' => $params['id']);
		$general = self::_getDataObject(array('table' => 'quotes', 'wheres' => $wheres));
		$data->general = $general;
		return $data;
	}
	//@todo move into toher area
	private static function _getDataObject($params) {
		$table = $params['table'];
		$wheres = $params['wheres'];
		$wheres = implode(' AND ', $wheres);
		$sql = "SELECT * FROM $table WHERE $wheres";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			error_log("results of query" . print_r($data, 1), 3, '/var/tmp/pmbackend.log');
			return $data;
		} catch(PDOException $e) {
			echo '{"error":{"text  for id '.$id.'":'. $e->getMessage() .'}}'; 
		}
	}

	public function put($object) {

	}

	public function delete($object) {

	}
	//@todo dry delete statement
	private static function _destroyCreateAssumptions($data, $objectId) {
		//Clean up
		$ands = array('query_id' => $objectId);
		$params = array('quoteId' => $objectId, 'table' => 'quote_assumptions', 'ands' => $ands);
		self::_cleanTable($params);
		//Now Insert
		$params = array('data' => $data, 'objectId' => $objectId, 'table' => 'quote_assumptions');
		$prepareQuery = self::_insertArrayBasedDataSet($params);
	}

	private static function _destroyCreateIncludedItems($data, $objectId) {
		//Clean up
		$ands = array('query_id' => $objectId, 'yesno' => '1');
		$params = array('quoteId' => $objectId, 'table' => 'quote_includes', 'ands' => $ands);
		self::_cleanTable($params);
		//Now Insert
		$params = array('data' => $data, 'objectId' => $objectId, 'table' => 'quote_includes');
		$prepareQuery = self::_insertArrayBasedDataSet($params);
	}

	private static function _destroyCreateNotIncludedItems($data, $objectId) {
		//Clean up
		$ands = array('query_id' => $objectId, 'yesno' => '0');
		$params = array('quoteId' => $objectId, 'table' => 'quote_includes', 'ands' => $ands);
		self::_cleanTable($params);
		//Now Insert
		$params = array('data' => $data, 'objectId' => $objectId, 'table' => 'quote_includes');
		$prepareQuery = self::_insertArrayBasedDataSet($params);
	}
	
	private static function _destroyCreateLineItems($data, $objectId) {
		//Clean up
		$ands = array('query_id' => $objectId);
		$params = array('quoteId' => $objectId, 'table' => 'quote_line_item', 'ands' => $ands);
		self::_cleanTable($params);
		//Now Insert
		$params = array('data' => $data, 'objectId' => $objectId, 'table' => 'quote_line_item');
		$prepareQuery = self::_insertArrayBasedDataSet($params);	
	}
	
	private static function _destroyCreateOverHead($data, $objectId) {
		//Clean up
		$ands = array('query_id' => $objectId);
		$params = array('quoteId' => $objectId, 'table' => 'quote_overhead', 'ands' => $ands);
		self::_cleanTable($params);
		//Now Insert
		$params = array('data' => $data, 'objectId' => $objectId, 'table' => 'quote_overhead');
		$prepareQuery = self::_insertArrayBasedDataSet($params);
	}

	private static function _prepareQueryArray($data) {		
		//Build Query from field labels and values
		$set = array();
		$valueFinal = array();
		foreach($data as $key => $value) {
			$set[] = $key;
			($key == 'created')  ? $value = date('Y-m-d H:i:s') : null;
			$valueFinal[] = (empty($value)) ? 'NULL' : $value;
		}
		$set = implode(', ', $set);
		$values = "'" . implode("', '", $valueFinal) . "'";

		return array('set' => $set, 'values' => $values);
	}

	private static function _insertArrayBasedDataSet($params) {
		$data = $params['data'];
		$objectId = $params['objectId'];
		$table = $params['table'];
		// //Build Query from field labels and values
		$set = array();
		$valueFinal = array();
		foreach($data as $key => $value) {
			foreach($value as $k2 => $v2) {		
				$set[] = $k2;
				($k2 == 'quote_id') ? $v2 = $objectId : null;
				$valueFinal[] = (empty($v2)) ? 'NULL' : $v2;
			}
			$set = implode(', ', $set);
			$values = "'" . implode("', '", $valueFinal) . "'";
			$sql = "INSERT INTO $table 
			 	($set) 
			 	VALUES 
			 	($values)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->execute();
				$db = null;
				$set = array();
				$valueFinal = array();
			} catch(PDOException $e) {
				error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
				echo '{"error":{"text":'. $e->getMessage() .'}}'; 
			}
		}
	}

	private static function _cleanTable($params) {
		$table = $params['table'];
		$ands = $params['ands'];
		$ands = implode(' AND ', $ands);

		$sql = "DELETE FROM $table WHERE $ands";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);
				$stmt->execute();
				$db = null;
			} catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

}