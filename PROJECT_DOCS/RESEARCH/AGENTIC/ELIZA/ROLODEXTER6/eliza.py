import random

class Eliza:
    def __init__(self):
        self.responses = {
            "hello": ["Hello! How can I help you today?", "Hi there! How are you feeling?"],
            "i feel": ["Why do you feel {0}?", "What makes you feel {0}?", "How long have you felt {0}?"],
            "i am": ["Why do you say you are {0}?", "How does being {0} make you feel?"],
            "default": ["Can you elaborate on that?", "I'm not sure I understand. Can you explain?", "Tell me more about that."]
        }

    def generate_response(self, user_input):
        user_input = user_input.lower()
        for key in self.responses.keys():
            if key in user_input:
                # Handle dynamic responses
                if "{0}" in self.responses[key][0]:
                    word = user_input.replace(key, "").strip()
                    return random.choice(self.responses[key]).format(word)
                return random.choice(self.responses[key])
        return random.choice(self.responses["default"])
