#!/usr/bin/env sh

# Gradle Wrapper Script

# Implementation guess: Download the gradle distribution specified in `gradle-wrapper.properties` if it is not already downloaded.

set -e

# get the directory containing this script
BASE_DIR=$(dirname "$0")

# get the `gradle-wrapper.properties`
GRADLE_WRAPPER_PROPERTIES_FILE="$BASE_DIR/gradle/wrapper/gradle-wrapper.properties"

# get the distribution url from `gradle-wrapper.properties`
DISTRIBUTION_URL=https://services.gradle.org/distributions/gradle-8.5-bin.zip

# Create the directory structure to store the downloaded wrapper jar
GRADLE_USER_HOME="$HOME/.gradle"
WRAPPER_JAR_PATH="$GRADLE_USER_HOME/wrapper/gradle-wrapper.jar"

# download gradle if its not installed
if [ ! -f "$WRAPPER_JAR_PATH" ]; then
    echo "Downloading Gradle distribution..."
    mkdir -p "$GRADLE_USER_HOME/wrapper"
    curl -L -o "$WRAPPER_JAR_PATH" "$DISTRIBUTION_URL"
fi

# Execute gradle using the wrapper jar
java -jar "$WRAPPER_JAR_PATH" "$@"