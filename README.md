# System E-BIBLIOTEKI
# Informacje
System e-biblioteki dla użytkowników **DO UŻYTKU WŁASNEGO I DO DOKOŃCZENIA, KOD NIE JEST W PEŁNI SKOŃCZONY**
System został zrobiony w języku JavaScript, HTML i CSS przy użyciu frameworku express. Bazą danych jest MySQL. W stronie dokończone nie jest pełen panel administratora i parę innych drobnych rzeczy.
Kod do zapisywania danych wykorzystuje szyfrowanie biblioteki bcrypt. Co uniemożliwa odczytanie hasła w bazie danych.
# Tutorial konfiguracji
Aby kod działał prawidłowo, po pobraniu plików upewnij się że masz zainstalowane na swoim komputerze:
1. Node.js
2. NPM

Jeśli masz pobrane te programy, otwórz terminal w projekcie i wpisz `npm i`. Po zainstalowaniu
wszystkich paczek, przejdź do pliku `.env` i uzupełnij odpowiednimi danymi:

```
PORT=3000 (port twojej strony)
HOST= (host do bazy danych twojej strony, np mysql.example.com)
USER= (nazwa użytkownika do bazy danych, np m184_example)
PASSWORD= (hasło do bazy danych)
DATABASE= (nazwa bazy danych)
```

Następnie do swojej bazy danych zaimportuj plik o nazwie systembiblioteki.sql aby wgrać strukturę bazy danych.
Gdy już uda ci się przejść przez te etapy, wpisz w konsoli `node app.js` i ciesz się stroną!

# Wyświetla mi się jakiś błąd, co zrobić?
Jako właściciel tego projektu, nie pomagam w naprawianiu kodu. Ten projekt jest bardziej jako prosty template do rozbudowy. 

# Czy mogę ten projekt wykorzystać do własnych celów?
Tak! Możesz __pod warunkiem że podasz w stopce źródło SRC strony__
