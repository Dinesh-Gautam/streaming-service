import React from 'react'

function FavouritePage({ favorite}) {
  return (
    <div>
      {favorite ? <div>
          {favorite.map(({title}) => {
            return (
              <div>
                {title}
              </div>
            )
          })}
        </div> : 
        <h1>Nothing Here</h1>
        }
    </div>
  )
}

export async function getServerSideProps() {

  return {
    props : {}
  }
}

export default FavouritePage