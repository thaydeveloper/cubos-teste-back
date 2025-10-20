export class EmailTemplates {
  static movieReleaseReminder(
    movie: any,
    user: any
  ): { subject: string; html: string } {
    return {
      subject: `🎬 ${movie.title} está disponível hoje!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lançamento de Filme</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .movie-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .movie-poster { width: 200px; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Lançamento Hoje!</h1>
              <p>O filme que você aguardava está disponível</p>
            </div>
            
            <div class="content">
              <h2>Olá, ${user.name}!</h2>
              <p>O filme <strong>${
                movie.title
              }</strong> que você adicionou à sua lista foi lançado hoje!</p>
              
              <div class="movie-info">
                ${
                  movie.imageUrl
                    ? `<img src="${movie.imageUrl}" alt="${movie.title}" class="movie-poster">`
                    : ""
                }
                <h3>${movie.title}</h3>
                <p><strong>Diretor:</strong> ${movie.director}</p>
                <p><strong>Gênero:</strong> ${movie.genre}</p>
                <p><strong>Duração:</strong> ${movie.duration} minutos</p>
                <p><strong>Avaliação:</strong> ⭐ ${movie.rating}/10</p>
                <p><strong>Data de Lançamento:</strong> ${new Date(
                  movie.releaseDate
                ).toLocaleDateString("pt-BR")}</p>
                
                ${
                  movie.description
                    ? `<p><strong>Sinopse:</strong><br>${movie.description}</p>`
                    : ""
                }
              </div>
              
              <p>🍿 Aproveite o filme!</p>
            </div>
            
            <div class="footer">
              <p>📧 Você recebeu este e-mail porque adicionou este filme à sua lista</p>
              <p>Movies App - Sua plataforma de filmes favorita</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  static welcomeUser(user: any): { subject: string; html: string } {
    return {
      subject: `🎬 Bem-vindo ao Movies App, ${user.name}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .feature { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Bem-vindo ao Movies App!</h1>
              <p>Sua jornada cinematográfica começa aqui</p>
            </div>
            
            <div class="content">
              <h2>Olá, ${user.name}!</h2>
              <p>Seja muito bem-vindo ao Movies App! Estamos felizes em tê-lo conosco.</p>
              
              <h3>🚀 O que você pode fazer:</h3>
              
              <div class="feature">
                <h4>📝 Gerenciar sua lista de filmes</h4>
                <p>Adicione, edite e organize seus filmes favoritos</p>
              </div>
              
              <div class="feature">
                <h4>🔔 Receber lembretes</h4>
                <p>Seja notificado quando seus filmes forem lançados</p>
              </div>
              
              <div class="feature">
                <h4>🖼️ Upload de imagens</h4>
                <p>Adicione capas personalizadas aos seus filmes</p>
              </div>
              
              <div class="feature">
                <h4>🔍 Filtros avançados</h4>
                <p>Encontre filmes por gênero, diretor, duração e muito mais</p>
              </div>
              
              <p>🎉 Aproveite todas as funcionalidades e boa diversão!</p>
            </div>
            
            <div class="footer">
              <p>Movies App - Sua plataforma de filmes favorita</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  static movieAddedNotification(
    movie: any,
    user: any
  ): { subject: string; html: string } {
    return {
      subject: `🎬 Novo filme adicionado: ${movie.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo Filme Adicionado</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .movie-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Filme Adicionado!</h1>
              <p>Você adicionou um novo filme à sua lista</p>
            </div>
            
            <div class="content">
              <h2>Olá, ${user.name}!</h2>
              <p>Seu filme <strong>${
                movie.title
              }</strong> foi adicionado com sucesso!</p>
              
              <div class="movie-info">
                <h3>${movie.title}</h3>
                <p><strong>Data de Lançamento:</strong> ${new Date(
                  movie.releaseDate
                ).toLocaleDateString("pt-BR")}</p>
                
                ${
                  new Date(movie.releaseDate) > new Date()
                    ? "<p>🔔 <strong>Lembrete:</strong> Você receberá um e-mail quando este filme for lançado!</p>"
                    : "<p>🎉 <strong>Disponível agora!</strong></p>"
                }
              </div>
            </div>
            
            <div class="footer">
              <p>Movies App - Sua plataforma de filmes favorita</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }
}
