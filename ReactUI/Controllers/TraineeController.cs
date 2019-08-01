using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE;
using BE.MainObjects;
using BE.Routes;
using BL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace ReactUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TraineeController : ControllerBase
    {
        private readonly BlImp bl = FactoryBl.GetObject;
        // GET: api/Trainee
        [HttpGet]
        public IEnumerable<Trainee> Get()
        {
            return bl.AllTrainees;
        }

        // GET: api/Trainee/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

       // POST: api/Trainee
       [HttpPost]
        public string Post([FromBody] Object val)
        {
            try
            {
                Trainee trainee = new Trainee();
                var value = (Newtonsoft.Json.Linq.JObject)val;
                if (!BE.Tools.CheckID_IL(uint.Parse((String)value["id"])))
                    return "Invalid Id!";

                //   BL.FactoryBl.GetObject.AddTester(value);
                foreach (var prop in trainee.GetType().GetProperties())
                {
                    if ((value[ToLower(prop.Name)]) is JArray)
                    {
                        var list = (value[ToLower(prop.Name)]).Select((license)=> {
                            TrainingDetails td = new TrainingDetails();
                            td.GearType = (Gear)Convert.ChangeType((license["gearType"]), typeof(Gear));
                            td.License = (LicenseType)Convert.ChangeType(license["license"], typeof(LicenseType));
                            td.NumberOfLessons = (int)Convert.ChangeType((license["numberOfLessons"]), typeof(int));
                            return td; 
                        });
                        trainee.LicenseTypeLearning = new List<TrainingDetails>();
                        foreach(var td in list)
                        {
                            trainee.LicenseTypeLearning.Add(td);
                        }
                    }
                    else if (prop.Name == "Address")
                    {
                        prop.SetValue(trainee, new Address((value[ToLower(prop.Name)].ToString())));
                    }
                    else if (prop.Name != "Schedule")
                    {
                        try
                        {
                            prop.SetValue(trainee, Convert.ChangeType((value[ToLower(prop.Name)]), prop.PropertyType));
                        }
                        catch (Exception ex) { }
                    }
                }
                trainee.LicenseType = new List<LicenseType>();
                System.Threading.Thread.Sleep(2000);
                bl.AddTrainee(trainee);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        // PUT: api/Trainee/5
        [HttpPut()]
        public string Put(int id, [FromBody] Object val) { 
             try
            {
                Trainee trainee = new Trainee();
        var value = (Newtonsoft.Json.Linq.JObject)val;
                if (!BE.Tools.CheckID_IL(uint.Parse((String) value["id"])))
                    return "Invalid Id!";

                //   BL.FactoryBl.GetObject.AddTester(value);
                foreach (var prop in trainee.GetType().GetProperties())
                {
                    if ((value[ToLower(prop.Name)]) is JArray)
                    {
                        var list = (value[ToLower(prop.Name)]).Select((license) => {
                            TrainingDetails td = new TrainingDetails();
                            td.GearType = (Gear)Convert.ChangeType((license["gearType"]), typeof(Gear));
                            td.License = (LicenseType)Convert.ChangeType(license["license"], typeof(LicenseType));
                            td.NumberOfLessons = (int)Convert.ChangeType((license["numberOfLessons"]), typeof(int));
                            return td;
                        });
        trainee.LicenseTypeLearning = new List<TrainingDetails>();
                        foreach(var td in list)
                        {
                            trainee.LicenseTypeLearning.Add(td);
                        }
}
                    else if (prop.Name == "Address")
                    {
                        prop.SetValue(trainee, new Address((value[ToLower(prop.Name)].ToString())));
                    }
                    else if (prop.Name != "Schedule")
                    {
                        try
                        {
                            prop.SetValue(trainee, Convert.ChangeType((value[ToLower(prop.Name)]), prop.PropertyType));
                        }
                        catch (Exception ex) { }
                    }
                }
                trainee.LicenseType = new List<LicenseType>();
                System.Threading.Thread.Sleep(2000);
                bl.UpdateTrainee(trainee);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            try
            {
                Trainee trainee = new Trainee();
                trainee.Id = (uint)id;
                bl.RemoveTrainee(trainee);
                System.Threading.Thread.Sleep(2000);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        private string ToLower(string str)
        {
            if (str != string.Empty && char.IsUpper(str[0]))
            {
                return char.ToLower(str[0]) + str.Substring(1);
            }
            return "";
        }
    }
}
