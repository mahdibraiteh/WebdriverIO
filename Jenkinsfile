pipeline {
    agent any

    tools {
        nodejs 'NodeJS_20'   // matches the name from Jenkins → Tools
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull latest code from GitHub
                git branch: 'main', url: 'https://github.com/mahdibraiteh/WebdriverIO.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Run WebdriverIO Tests') {
            steps {
                echo 'Running WebdriverIO tests...'
                sh 'npx wdio run ./wdio.conf.js'
            }
        }
    }

    post {
        success {
            echo '✅ All tests passed successfully!'
        }
        failure {
            echo '❌ Some tests failed. Check reports in Jenkins.'
        }
    }
}