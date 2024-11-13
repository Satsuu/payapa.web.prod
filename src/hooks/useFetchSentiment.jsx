import { useState, useEffect } from 'react'
import { firestore } from '../services/Firebase'
import { collection, getDocs } from 'firebase/firestore'

function useFetchSentiment(userIds) {
  const [sentiments, setSentiments] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSentiments = async () => {
      setLoading(true)
      try {
        const sentimentCollection = collection(firestore, 'detected_labels')
        const querySnapshot = await getDocs(sentimentCollection)

        const sentimentData = {}
        querySnapshot.forEach((doc) => {
          if (userIds.includes(doc.id)) {
            sentimentData[doc.id] = doc.data().label || 'No sentiment data'
          }
        })

        setSentiments(sentimentData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (userIds.length) {
      fetchSentiments()
    }
  }, [userIds])

  return { sentiments, loading, error }
}

export default useFetchSentiment
