﻿using System;
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
                       // var list = (value[ToLower(prop.Name)]).ToObject<List<BE.LicenseType>>();
                       // prop.SetValue(trainee, list);
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
                bl.AddTrainee(trainee);
                return "OK";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        //// PUT: api/Trainee/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
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
