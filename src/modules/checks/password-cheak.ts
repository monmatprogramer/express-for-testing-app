const writePassword = async (hashPassword: string): Promise<void> => {
  try {
    await writeFile(filepath, hashPassword, "utf-8");
    console.log("Password is saved.");
  } catch (error) {
    console.log("Error: ", error);
  }
};

const readPassword = async (filePath: string): Promise<string> => {
  return readFile(filePath, "utf-8");
};

console.log("Start");
hashPassword("123456")
  .then((result) => writePassword(result))
  .catch(async (error) => {
    console.log(error);
  });
readPassword(filepath)
  .then((result) => {
    verifyPassword("1234567", result).then((result) =>
      console.log("result is ", result),
    );
  })
  .catch(async (err) => console.error("err: ", err))
  .catch(async (error) => console.error("Error", error));
