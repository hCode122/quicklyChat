const useLoadMessages = (user) => {
  const loadMessages = async (depth, chatId) => {
    try {
      const data = await fetch(
        "https://quicklychat.onrender.com/api/data/loadMessages",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "bearer " + user.token,
          },
          body: JSON.stringify({
            depth: depth,
            chat: chatId,
          }),
        }
      )
        .then((result) => result.json())
        .then((data) => {
          return data;
        });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  return loadMessages;
};

export default useLoadMessages;
