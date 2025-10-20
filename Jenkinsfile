pipeline {
    agent any

    environment {
        NODE_VERSION = '20'                       // Node version configured in Jenkins
        REPORT_DIR = 'junit-reports'                    // JUnit output folder
        ALLURE_RESULTS_DIR = 'allure-results'     // Allure results folder
        ALLURE_REPORT_DIR = 'allure-report'       // Allure report folder
        // SLACK_CHANNEL = '#qa-notifications'       // Optional Slack channel
    }

    tools {
        nodejs "NodeJS_${env.NODE_VERSION}"
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
    }

    triggers {
        // Trigger build on every push (GitHub webhook)
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing NPM dependencies..."
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo "🧹 Linting test files..."
                sh 'npx eslint ./test || true'
            }
        }

        stage('Run Tests in Parallel') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chrome', 'firefox'
                    }
                }
                stages {
                    stage("Run on ${BROWSER}") {
                        steps {
                            echo "🚀 Running tests on ${BROWSER}"
                            sh """
                            export BROWSER=${BROWSER}
                            mkdir -p ${REPORT_DIR}/junit
                            npx wdio run wdio.conf.js --suite smoke || true
                            """
                        }
                    }
                }
            }
        }

        stage('Publish Test Reports') {
            steps {
                echo "📊 Publishing test results..."
                junit allowEmptyResults: true, testResults: "${REPORT_DIR}/junit/**/*.xml"
                allure includeProperties: false, results: [[path: "${ALLURE_RESULTS_DIR}"]]
            }
        }

        stage('Generate Allure Report') {
            steps {
                echo "🧾 Generating Allure report..."
                sh """
                npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR} || true
                """
                archiveArtifacts artifacts: "${ALLURE_REPORT_DIR}/**", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning workspace..."
            cleanWs()
        }

        failure {
            echo "❌ Tests failed on build #${env.BUILD_NUMBER}"
            // Uncomment this block if Slack plugin is configured
            /*
            slackSend(
                channel: "${SLACK_CHANNEL}",
                color: '#ff0000',
                message: "❌ WebdriverIO tests failed for *${env.JOB_NAME}* (build #${env.BUILD_NUMBER}). Check Jenkins for details."
            )
            */
        }

        success {
            echo "✅ Tests completed successfully!"
        }
    }
}
