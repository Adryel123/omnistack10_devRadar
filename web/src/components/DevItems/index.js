import React from 'react'

import './styles.css'

function DevItem(props) {   // Outra forma: desestruturação direto, DevItem({ dev })
  const { dev, onClick } = props

  async function handleClick(e) {
    await onClick({
      github_username: dev.github_username
    })

  }

  return (
    <li className="dev-item">
      <button onClick={handleClick} >x</button>
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
    </li>
  )
}

export default DevItem
