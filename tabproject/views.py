from django.shortcuts import render
from django.http import HttpResponse
import os


def index(request):
	return render(request, 'tabproject/index.html')

def parsing(request):
	# if request.method == 'get':
	rp = os.path.dirname(os.path.abspath(__file__))
	fp = "{}/parsing/output.json".format(rp)
	with open(fp, 'r') as file:
		data = file.read()

	return HttpResponse(data)

def gapiValid(request):
	return render(request, 'gapi/google3cebc5b9808be979.html')
