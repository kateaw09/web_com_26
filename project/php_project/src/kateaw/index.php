<?php 
$servername = "mysql";
$username = "root";
$password = "root";
$dbname = "data_kateaw";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form method="post">
        <label for="name">ชื่อ</label>
        <input type="text" name="firstName">

        <label for="lastName">นามสกุล</label>
        <input type="text" name="lastName">

        <button type="submit" name="fullNameSubmit">submit</button>
    </form>

    <?php echo "ทดสอบ" ?>
</body>

</html>

<?php
// สมมติว่าคุณมีไฟล์เชื่อมต่อฐานข้อมูลอยู่แล้ว เช่น include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // 1. รับค่าและป้องกันการกรอกข้อมูลว่างเปล่า (Optional)
    $first = isset($_POST['firstName']) ? $_POST['firstName'] : '';
    $last = isset($_POST['lastName']) ? $_POST['lastName'] : '';

    if (!empty($first) && !empty($last)) {
        
        // 2. ใช้ Prepared Statements เพื่อป้องกัน SQL Injection (สำคัญมาก!)
        $stmt = mysqli_prepare($conn, "INSERT INTO user (firstName, lastName) VALUES (?, ?)");
        
        // "ss" หมายถึง data type เป็น string ทั้งคู่
        mysqli_stmt_bind_param($stmt, "ss", $first, $last);

        if (mysqli_stmt_execute($stmt)) {
            echo "บันทึกข้อมูลสำเร็จ: " . htmlspecialchars($first) . " " . htmlspecialchars($last);
        } else {
            echo "เกิดข้อผิดพลาด: " . mysqli_error($conn);
        }

        mysqli_stmt_close($stmt);
    } else {
        echo "กรุณากรอกข้อมูลให้ครบถ้วน";
    }
}
?>
