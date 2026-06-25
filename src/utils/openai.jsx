const openai = {
  chat: {
    completions: {
      create: async (params) => {
        const response = await fetch(
          "/api/openai/chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(params),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "API request failed"
          );
        }

        return data;
      },
    },
  },
};

export default openai;