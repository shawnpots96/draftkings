<?php
try {
	$database = new SQLiteDatabase('Draftkings.sqlite', 0666, $error);
}

catch(Exception $e) {
	die($error);
}

$query = "SELECT * FROM DKTable";

if($result = $database->query($query, SQLITE_BOTH, $error)) {
	print "<table border=1>";
	print "<tr><td>YearWeek</td><td>Position</td><td>Player</td><td>ActualPts</td></tr>";
	while($row = $result->fetch()) {
		print "<tr><td>{$row['YearWeek']}</td><td>{$row['Position']}</td><td>{$row['Player']}</td><td>$row['ActualPts']}</td></tr>";
	}
	print "</table>";
}
else {
	die($error);
}
?>