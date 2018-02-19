<?php
try {
	$database = new SQLiteDatabase('Draftkings.sqlite', 0666, $error);
}

catch(Exception $e) {
	die($error);
}

$query = "SELECT * FROM Dogs";

if($result = $database->query($query, SQLITE_BOTH, $error)) {
	print "<table border=1>";
	print "<tr><td>Id</td><td>Breed</td><td>Name</td><td>Age</td></tr>";
	while($row = $result->fetch()) {
		print "<tr><td>{$row['Id']}</td><td>{$row['Breed']}</td><td>{$row['Name']}</td><td>$row['Age']}</td></tr>";
	}
	print "</table>";
}
else {
	die($error);
}
?>