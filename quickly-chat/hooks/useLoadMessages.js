const useLoadMessages = (token) => {
  const loadMessages = async (depth, chatId) => {
    try {
      const messages = await fetch(
        "http://localhost:3001/api/data/loadMessages",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "bearer " + token,
          },
          body: JSON.stringify({
            depth: depth,
            chat: chatId,
          }),
        }
      )
        .then((result) => result.json())
        .then((messages) => {
          return messages;
        });

      return messages;
    } catch (e) {
      console.log(e);
    }
  };

  return loadMessages;
};

export default useLoadMessages;
