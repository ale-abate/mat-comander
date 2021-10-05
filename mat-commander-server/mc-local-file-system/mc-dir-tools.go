package mc_local_file_system

import (
	"log"
	"regexp"
	"strings"
)

var RootTypeRegistry = getDirectoryOperations()

func getDirectoryOperations() map[string]DirectoryOperations {
	var rootTypeRegistry = map[string]DirectoryOperations{}
	ntfs := NTFS{}
	rootTypeRegistry["NTFS"] = &ntfs
	rootTypeRegistry["ext3"] = &ntfs
	rootTypeRegistry["ext4"] = &ntfs
	return rootTypeRegistry
}

func AccessOperationsFor(root *McRootFolder) DirectoryOperations {
	impl := RootTypeRegistry[root.Type]
	if impl == nil {
		log.Println("ERROR: Cannot solve path for ", root.Type)
	}
	return impl
}

func MapStringPathToMcFile(root McRootFolder, path string) McFile {
	var file McFile
	AccessOperationsFor(&root).convertPathToMcFile(path, &file)
	return file
}

func ConvertPathStringToArray(path string) []string {
	path = strings.TrimSuffix(path, "/")
	path = strings.TrimSuffix(path, "\\")
	path = strings.TrimPrefix(path, "/")
	path = strings.TrimPrefix(path, "\\")

	re := regexp.MustCompile(`[\\/]`)
	return re.Split(path, -1)
}
