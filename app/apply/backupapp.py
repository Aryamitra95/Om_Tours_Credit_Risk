from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = pickle.load(open("xgb_model.pkl","rb"))

@app.route('/apply/results/dashboard', methods=['POST'])
def predict():
    try:
        # Amount | Term | All_active_acc | Default_acc | Acc_opened_12m | Acc_age | Balance | no_of_defaults | Loan_purpose(debt,home,personal,vehicle,other) | Employment_type(Full,part,self,retired)
        p=['debt','home','other','personal','vehicle']
        e=['full','part','self','retired']
        
        data = request.get_json()
        seq=['amount','term','all_active_acc','acc_opened_12m','acc_age','balance','no_of_defaults','loan_purpose','employment_type']
        d=[]
        for i in seq:
            d.append(data[i])
            
        l=d[:-2]

        for i,ii in enumerate(p):
            if ii==d[-2]:
                a=[0,0,0,0,0]
                a[i]=1
                l.extend(a)
            else :
                l.extend([1,0,0,0,0])

        for j,jj in enumerate(e):
            if jj==d[-1]:
                b=[0,0,0,0]
                b[j]=1
                l.extend(b)
            else:
                l.extend([1,0,0,0])
            
        prediction = (1-model.predict_proba(np.array(l).reshape(1, -1))[0][1])*100
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)




