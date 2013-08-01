import json, hashlib, uuid, time, datetime, urllib, urllib2

class ChangeMedicationRequest:
  URL = 'https://app2.cbits.northwestern.edu/prImporter'

  def __init__(self, participant_id, message):
    self.participant_id = participant_id
    self.message = message
    self.status = 'dirty'
    self.error = None

  def save(self):
    try:
      request = urllib2.urlopen(self.URL, self.__serialize())
      response = json.loads(request.read())
      if response['Status'] == 'success':
        self.status = 'saved'
      elif response['Status'] == 'error':
        self.status = 'error'
        self.error = response['Payload']
      else:
        self.status = 'error'
        self.error = 'Unknown error'
    except urllib2.URLError as e:
      self.status = 'error'
      self.error = e

  def __serialize(self):
    user_hash = hashlib.md5(self.participant_id).hexdigest()
    operation = 'SubmitProbes'
    payload = json.dumps([{
      'PROBE': 'researcher_messages',
      'GUID': uuid.uuid4().__str__(),
      'TIMESTAMP': time.mktime(datetime.datetime.now().timetuple()),
      'message': self.message
    }])

    return urllib.urlencode({
      'json': json.dumps({
        'Operation': operation,
        'UserHash': user_hash,
        'Payload': payload,
        'Checksum': hashlib.md5(user_hash + operation + payload).hexdigest()
      })
    })
