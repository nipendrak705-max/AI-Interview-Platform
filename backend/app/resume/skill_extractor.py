def extract_skills(text):

    skills = []

    keywords = [
        "python",
        "java",
        "c++",
        "sql",
        "mysql",
        "fastapi",
        "django",
        "flask",
        "machine learning",
        "deep learning",
        "tensorflow",
        "pytorch",
        "html",
        "css",
        "javascript",
        "react",
        "node",
        "mongodb",
        "git",
        "docker"
    ]

    text = text.lower()

    for skill in keywords:
        if skill in text:
            skills.append(skill)

    return skills