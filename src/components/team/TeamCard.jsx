const TeamCard = (props) => {
  const teams = props.teams;
  return (
    <>
      {teams.map((val) => (
        <div className='items shadow' key={val.id}>
          <div className='img'>
            <img src={"https://i.stack.imgur.com/l60Hf.png"} alt='' />
            <div className='overlay'>
              <i className='fab fa-facebook-f icon'></i>
              <i className='fab fa-twitter icon'></i>
              <i className='fab fa-instagram icon'></i>
              <i className='fab fa-tiktok icon'></i>
            </div>
          </div>
          <div className='details'>
            <h2>{val.fullName}</h2>
            <p>{val.fullName}</p>
          </div>
        </div>
      ))}
    </>
  )
}

export default TeamCard
