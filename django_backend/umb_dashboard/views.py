from django.core import serializers
from django.http import HttpResponse

def respond_with_json(query_set):
  json = serializers.serialize("json", query_set)
  return HttpResponse(json, content_type="application/json")
