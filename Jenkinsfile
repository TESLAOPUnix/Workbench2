pipeline {
    agent any
    environment{
        APP_NAME = "workbench"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_NAME = "kendralabs" + "/" + "${APP_NAME}"
        REGISTRY_CREDS = 'dockerhub'
    }
    stages {
        stage('Clear Workspace'){
            steps{
                script{
                    cleanWs()
                }
            }
        }
        stage('git Checkout') {
            steps {
                script{
                    git credentialsId: 'github',
                    url: 'https://github.com/Kendralabs/Workbench.git',
                    branch: 'main'
                }
            }
        }
        stage('build docker image'){
            steps{
                script{ 
                    docker_image = docker.build "${IMAGE_NAME}" 
                }
            }
        }
        stage('push docker image'){
            steps{
                script{
                    docker.withRegistry('',REGISTRY_CREDS){
                        docker_image.push("$BUILD_NUMBER")
                        docker_image.push('latest')
                    }
                }
            }
        }
    }
}
