from eliza import Eliza

eliza_bot = Eliza()
while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        print("Eliza: Goodbye!")
        break
    response = eliza_bot.generate_response(user_input)
    print(f"Eliza: {response}")
