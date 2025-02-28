const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Heroku يحدد المنفذ تلقائيًا

// Middleware لتحليل البيانات المرسلة عبر النموذج
app.use(bodyParser.urlencoded({ extended: true }));

// خدمة الملفات الثابتة (مثل CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// مسار الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// مسار صفحة الإدارة
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// مسار لتلقي الاقتراحات
app.post('/submit-suggestion', (req, res) => {
    const suggestion = req.body.suggestion;

    // حفظ الاقتراح في ملف
    fs.appendFile('suggestions.txt', suggestion + '\n', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('حدث خطأ أثناء حفظ الاقتراح');
        }
        res.send('تم استلام الاقتراح بنجاح!');
    });
});

// مسار لقراءة الاقتراحات
app.get('/get-suggestions', (req, res) => {
    fs.readFile('suggestions.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('حدث خطأ أثناء قراءة الاقتراحات');
        }
        res.send(data);
    });
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});
