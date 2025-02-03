import nltk
from nltk.chat.util import Chat, reflections

# Define simple conversation rules
pairs = [
    (r"hi|hello|hey", ["Hello!", "Hey there!", "Hi!"]),
    (r"how are you?", ["I'm just a bot, but I'm good! How about you?"]),
    (r"what is your name?", ["I'm an AI assistant using NLTK."]),
    (r"quit", ["Goodbye!", "See you later!"]),
]

# Create chatbot
chatbot = Chat(pairs, reflections)

# Run chat loop
print("Simple AI Chatbot (type 'quit' to exit)")
while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        print("Bot: Goodbye!")
        break
    print("Bot:", chatbot.respond(user_input))
