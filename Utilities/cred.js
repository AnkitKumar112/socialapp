let serverURLs = {
    "dev": {
        "NODE_SERVER": "http://localhost",
        "NODE_SERVER_PORT": "3012",
        "MYSQL_HOST": 'localhost',
        "MYSQL_USER": 'root',
        "MYSQL_PASSWORD": '',
        'MYSQL_DATABASE': 'socialapp',
        "EMAIL_USER": 'test.techugo@gmail.com',
        "EMAIL_PASS": 'LUCKY@05',
        "EMAIL_HOST": 'smtp.gmail.com',
        "EMAIL_PORT": 465,
        "EMAIL_SECURE": true,
    },
    "live": {
        "NODE_SERVER": "http://52.27.53.102/",
        "NODE_SERVER_PORT": "3012",
        "MYSQL_HOST": 'localhost',
        "MYSQL_USER": 'socialapp',
        "MYSQL_PASSWORD": 'Ypr*&87(*',
        'MYSQL_DATABASE': 'socialapp',
        "EMAIL_USER": 'test.techugo@gmail.com',
        "EMAIL_PASS": 'LUCKY@05',
        "EMAIL_HOST": 'smtp.gmail.com',
        "EMAIL_PORT": 465,
        "EMAIL_SECURE": true,
    }
}

module.exports = {
    serverURLs: serverURLs
}