# ------------------------------
# FILE: backend/Dockerfile
# ------------------------------
FROM node:20-bullseye

# Install pdflatex and all necessary LaTeX packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code into JavaScript
RUN npm run build

# Expose the port the server will run on
EXPOSE 5000

# Command to run the compiled application
CMD ["npm", "start"]