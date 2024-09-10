import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Record = () => {
  const [records, setRecords] = useState([]);

  const getRecords = async () => {
    await axios.get(`http://localhost:3000/records`)
      .then((response) => {
        setRecords(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  useEffect(() => {
    getRecords();
  }, []);
  return (
    <main>
      {
        records.length > 0 ? (
          <section>
            {records.map((record, index) => (
              <div key={index}>
                <ul>
                  <li>User ID: {record.user_id}</li>
                  <li>Answer ID: {record.answer_id}</li>
                  <a href={`https://sbpmb-express.amisbudi.cloud/records/${record.id}`} className='underline'>Download</a>
                </ul>
              </div>
            ))}
          </section>
        ) : (
          <p>Data records tidak ada</p>
        )
      }
    </main>
  )
}

export default Record