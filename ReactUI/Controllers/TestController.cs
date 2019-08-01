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
    public class TestController : ControllerBase
    {
        private readonly BlImp bl = FactoryBl.GetObject;
        // GET: api/Test
        [HttpGet]
        public IEnumerable<Test> Get()
        {
            return bl.AllTests;
        }

        // GET: api/Test/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Test
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Test/5
        [HttpPut()]
        public string Put([FromBody] Object val)
        {
            try
            {
                Test test = new Test();
                var value = (Newtonsoft.Json.Linq.JObject)val;
          
                //   BL.FactoryBl.GetObject.AddTester(value);
                foreach (var prop in test.GetType().GetProperties())
                {
                    if ((value[ToLower(prop.Name)]) is JArray)
                    {
                        test.Criteria = new List<Criterion>();
                        foreach (var cri in value[ToLower(prop.Name)])
                        {
                            test.Criteria.Add(new Criterion(cri["type"].ToString(), (bool)cri["pass"]));
                        }
                    }
                    else if (prop.Name == "AddressOfBeginningTest")
                    {
                        prop.SetValue(test, new Address((value[ToLower(prop.Name)].ToString())));
                    }
                    else if(prop.Name != "XmlSaveRouteUrlSerializer")
                    {
                        try
                        {
                            prop.SetValue(test, Convert.ChangeType((value[ToLower(prop.Name)]), prop.PropertyType));
                        }
                        catch (Exception ex) { };
                    }
                }
                 System.Threading.Thread.Sleep(2000);
                test.ActualTestTime = DateTime.Now;
                bl.UpdateTest(test);
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
                Test test = new Test();
                test.Id = $"{id:00000000}";
                bl.RemoveTest(test);
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
